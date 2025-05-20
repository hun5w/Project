import request from "@/utils/request";

// 手机 + 密码 登录
export function loginWithPassword(phone, password) {
  return request.get("/login/cellphone", {
    params: { phone, password }
  });
}

// 发送验证码
export function sendCaptcha(phone) {
  return request.get("/captcha/sent", {
    params: { phone }
  });
}

// 验证验证码
export function verifyCaptcha(phone, code) {
  return request.get("/captcha/verify", {
    params: { phone, captcha: code }
  });
}
