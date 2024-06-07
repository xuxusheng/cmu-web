import { Divider, Flex, message, Skeleton, Space, Spin, Typography } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth.ts'
import BgVideo from './bg.mp4'
import Bg from './bg.webp'
import Logo from './logo.png'

import { LockOutlined, UserOutlined } from '@ant-design/icons'
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormText
} from '@ant-design/pro-components'

import { useQuery } from '@tanstack/react-query'
import { useSystemStore } from '../../store/system.ts'
import { setToken } from '../../utils/token.ts'
import styles from './index.module.scss'

interface FormValues {
  username: string
  password: string
  captchaText: string // 验证码
}

/**
 * 登录页面
 */
const LoginPage: FC = () => {
  const navigate = useNavigate()

  // ----------------------------- State -----------------------------
  const theme = useSystemStore((state) => state.theme)

  // ----------------------------- React-Query -----------------------------
  const captchaQuery = useQuery({
    queryFn: authApi.getCaptcha,
    queryKey: [authApi.getCaptcha.name]
  })
  const captcha = captchaQuery.data?.data.data

  // ----------------------------- Method -----------------------------
  const login = async (values: FormValues) => {
    const { username, password, captchaText } = values

    if (!captcha) {
      return
    }

    const res = await authApi.loginByPassword({
      username,
      password,
      captchaText,
      captchaId: captcha.id
    })

    const token = res.data.data?.token

    if (!token) {
      const msg = '接口返回 Token 信息错误，请联系管理员'
      message.error(msg)
      throw new Error(msg)
    }

    setToken(token)
    message.success('登录成功！')

    // 跳转首页
    navigate('/main/home')
  }

  return (
    <div className={styles.main}>
      <LoginFormPage
        backgroundImageUrl={theme === 'light' ? Bg : ''}
        backgroundVideoUrl={theme === 'dark' ? BgVideo : ''}
        onFinish={login}
      >
        <Flex align="center" gap={16} justify="center" vertical={true}>
          <img
            alt="logo"
            src={Logo}
            style={{ height: 48, objectFit: 'contain' }}
          />

          <Space align="center" direction="vertical">
            <Typography.Title level={3} style={{ margin: 0 }}>
              变电设备综合监测系统
            </Typography.Title>
            <Typography.Text type="secondary">WHJY-CMU2000</Typography.Text>
          </Space>
        </Flex>

        <Divider></Divider>
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />
          }}
          name="username"
          placeholder="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名！'
            }
          ]}
        />
        <ProFormText.Password
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />
          }}
          name="password"
          placeholder={'密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！'
            }
          ]}
        />
        <ProFormCaptcha
          captchaProps={{
            size: 'large',
            style: {
              padding: 0,
              backgroundColor: theme === 'dark' ? '#bbb' : 'transpant'
            },
            disabled: captchaQuery.isFetching
          }}
          captchaTextRender={() => {
            if (!captcha) {
              return (
                <Skeleton.Button
                  active={true}
                  size="large"
                  style={{ display: 'block', width: 120 }}
                />
              )
            }
            return (
              <Spin
                spinning={captchaQuery.isFetching}
                style={{ height: '40px' }}
              >
                <img
                  alt="captcha"
                  src={`data:image/svg+xml;base64,${btoa(captcha.svg)}`}
                  style={{ height: '40px' }}
                />
              </Spin>
            )
          }}
          countDown={0.1}
          fieldProps={{
            size: 'large'
          }}
          name="captchaText"
          placeholder="验证码"
          rules={[
            {
              required: true,
              message: '请输入验证码！'
            }
          ]}
          onGetCaptcha={async () => {
            captchaQuery.refetch()
          }}
        />
      </LoginFormPage>

      <div className={styles.footer}>
        <Typography.Text type="secondary">
          ©
          {new Date().getFullYear() === 2023
            ? '2023'
            : `2023-${new Date().getFullYear()}`}{' '}
          <Typography.Link href="http://www.whjiuyu.cn" target="_blank">
            武汉九宇电力科技有限公司
          </Typography.Link>
        </Typography.Text>
        {/*<Divider type="vertical" />*/}
        {/*<Typography.Text type="secondary">*/}
        {/*  软件版本：WHJY-CMU2000*/}
        {/*</Typography.Text>*/}
      </div>
    </div>
  )
}

export default LoginPage
