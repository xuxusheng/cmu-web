import { useQuery } from '@tanstack/react-query'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Modal } from 'antd'
import { FC, useMemo } from 'react'

import { QueryKey } from '../../../../api/query-key.ts'
import { systemApi } from '../../../../api/system.ts'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export const ChangelogModal: FC<Props> = (props) => {
  const { open, setOpen } = props

  // ---------------------------------- React-Query ----------------------------------
  const changelogQuery = useQuery({
    queryKey: [QueryKey.SystemChangelog],
    queryFn: () => systemApi.getChangelog(),
    gcTime: 1000 * 60 * 60 * 24 * 7 // 7 days
  })

  const changelog = useMemo(() => {
    const content = changelogQuery.data?.data.data.content || ''
    // return content
    // 找到 content 字符串中，第一个 \n 的索引位置
    const index = content.indexOf('\n')
    return index > -1 ? content.slice(index + 3) : content
  }, [changelogQuery.data])

  return (
    <Modal
      title="CMU-WEB 更新日志"
      open={open}
      styles={{
        header: {
          // display: 'none'
        }
      }}
      cancelText={null}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      cancelButtonProps={{
        style: { display: 'none' }
      }}
    >
      <div
        className="bg-stone-50 rounded"
        style={{
          maxHeight: '70vh',
          overflowY: 'auto'
        }}
      >
        <MarkdownPreview source={changelog} />
      </div>
    </Modal>
  )
}
