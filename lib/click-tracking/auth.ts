import "server-only";

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "click_log_admin";
const SESSION_SECONDS = 12 * 60 * 60;

function config() {
  const username = process.env.CLICK_LOG_ADMIN_USERNAME;
  const password = process.env.CLICK_LOG_ADMIN_PASSWORD;
  const secret = process.env.CLICK_LOG_SESSION_SECRET;
  if (!username || !password || !secret || secret.length < 32) return null;
  return { username, password, secret };
}

export function hasClickLogAdminEnv() {
  return Boolean(config());
}

function constantTimeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function signature(expires: string, secret: string) {
  return createHmac("sha256", secret).update(`click-log-admin:${expires}`).digest("base64url");
}

export function validateClickLogCredentials(username: string, password: string) {
  const env = config();
  if (!env) return false;
  return constantTimeEqual(username, env.username) && constantTimeEqual(password, env.password);
}

export async function createClickLogSession() {
  const env = config();
  if (!env) throw new Error("Click log admin environment variables are missing.");
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const token = `${expires}.${signature(expires, env.secret)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin/click-logs",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearClickLogSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin/click-logs",
    maxAge: 0,
  });
}

export async function hasValidClickLogSession() {
  const env = config();
  if (!env) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [expires, suppliedSignature] = token.split(".");
  if (!expires || !suppliedSignature || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  return constantTimeEqual(suppliedSignature, signature(expires, env.secret));
}

export async function requireClickLogAdmin() {
  if (!(await hasValidClickLogSession())) redirect("/admin/click-logs/login");
}
