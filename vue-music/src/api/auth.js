import request from '@/utils/request';

// 发送验证码
export function sendCaptcha(phone) {
  return request.get('/captcha/sent', {
    params: { phone }
  });
}

// 验证验证码登录
export function verifyCaptcha(phone, captcha) {
  return request.get('/captcha/verify', {
    params: { phone, captcha }
  });
}
