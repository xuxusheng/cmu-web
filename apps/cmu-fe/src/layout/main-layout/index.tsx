import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import {
  ProLayout,
  ProLayoutProps,
  WaterMark
} from '@ant-design/pro-components'
import { useQuery } from '@tanstack/react-query'
import { Dropdown, Flex, FloatButton, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import { FC, useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { QueryKey } from '../../api/query-key.ts'
import { userApi } from '../../api/user.ts'
import { useTimeTicker } from '../../hook/use-time-ticker.tsx'
import { siderMenu } from '../../router/sider-menu.tsx'
import { removeToken } from '../../utils/token.ts'
import styles from './index.module.scss'

export const MainLayout: FC = () => {
  const navigate = useNavigate()

  // ----------------------------- State ----------------------------- //
  const { time } = useTimeTicker(dayjs())

  // ----------------------------- React-Query -----------------------------
  const meQuery = useQuery({
    queryKey: [QueryKey.Me],
    queryFn: userApi.me
  })

  // ----------------------------- UseMemo -----------------------------
  const me = useMemo(() => meQuery.data?.data.data, [meQuery.data])

  // ----------------------------- Method -----------------------------
  const handleGoToHome = () => {
    // 跳转到首页
    navigate('/')
  }

  const handleLogout = () => {
    // 清除 token 并跳转登录页
    removeToken()
    navigate('/login')
  }

  // ----------------------------- Render -----------------------------

  const avatarProps: ProLayoutProps['avatarProps'] = {
    size: 'small',
    title: me?.username,
    icon: <UserOutlined />,
    render: (_, dom) => {
      return (
        <Dropdown
          menu={{
            items: [
              {
                key: 'user-info',
                icon: <UserOutlined />,
                label: '个人信息',
                onClick: () => {
                  navigate('/main/user-info')
                }
              },
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录',
                onClick: handleLogout
              }
            ]
          }}
        >
          {dom}
        </Dropdown>
      )
    }
  }

  const menuFooterRender: ProLayoutProps['menuFooterRender'] = (props) => {
    // eslint-disable-next-line react/prop-types
    if (props?.collapsed || props?.isMobile) {
      return undefined
    }
    return (
      <Space
        align="center"
        direction="vertical"
        size="small"
        style={{ width: '100%' }}
      >
        {/*<Typography.Text>{time?.format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>*/}
        <Typography.Text style={{ color: '#fff' }} type="secondary">
          ©
          {new Date().getFullYear() === 2023
            ? '2023'
            : `2023-${new Date().getFullYear()}`}{' '}
          <Typography.Link
            href="http://www.whjiuyu.cn"
            style={{ color: '#fff' }}
            target="_blank"
          >
            九宇电力
          </Typography.Link>
        </Typography.Text>
      </Space>
    )
  }

  const menItemRender: ProLayoutProps['menuItemRender'] = (item, dom) => {
    return (
      <div
        onClick={() => {
          navigate(item.path || '/main/home')
        }}
      >
        {dom}
      </div>
    )
  }

  const actionsRender: ProLayoutProps['actionsRender'] = () => {
    return [
      <Typography.Text key="time" style={{ color: '#fff' }}>
        {time?.format('YYYY-MM-DD HH:mm:ss')}
      </Typography.Text>
    ]
  }

  return (
    <div className={styles.main}>
      <ProLayout
        actionsRender={actionsRender}
        avatarProps={avatarProps}
        headerTitleRender={(logo, title) => (
          <Flex
            align="center"
            style={{ cursor: 'pointer' }}
            onClick={handleGoToHome}
          >
            {logo}
            {title}
          </Flex>
        )}
        layout="mix"
        logo={false}
        menuFooterRender={menuFooterRender}
        menuItemRender={menItemRender}
        route={siderMenu}
        title="变电设备综合监测系统"
        token={{
          header: {
            // 这个不能设置渐变，直接用 css 设置背景好了
            // colorBgHeader: '#169e8c',
            colorTextRightActionsItem: '#fff',
            colorHeaderTitle: '#fff',
            colorTextMenu: '#fff'
          },
          sider: {
            colorMenuBackground: 'linear-gradient(to bottom, #169e8c, #169e99)',
            colorTextMenu: '#fff',
            colorTextMenuActive: '#fff',
            colorTextMenuTitle: '#fff',
            colorTextMenuSelected: '#fff',
            colorTextMenuItemHover: '#fff'
          }
        }}
      >
        <WaterMark content={me?.username}>
          <Outlet />
        </WaterMark>

        <FloatButton.BackTop type="primary" />
      </ProLayout>
    </div>
  )
}
