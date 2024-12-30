import { useQuery } from '@tanstack/react-query'
import { Modal } from 'antd'
import { FC, useMemo } from 'react'

import { QueryKey } from '../../../../api/query-key.ts'
import { systemApi } from '../../../../api/system.ts'

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export const CollectorChangelogModal: FC<Props> = (props) => {
  const { open, setOpen } = props

  // ---------------------------------- React-Query ----------------------------------
  const changelogQuery = useQuery({
    queryKey: [QueryKey.CollectorChangelog],
    queryFn: () => systemApi.getCollectorChangelog(),
    gcTime: 1000 * 60 * 60 * 24 * 7 // 7 days
  })

  const changelog = useMemo(() => {
    return changelogQuery.data?.data.data.content || ''
  }, [changelogQuery.data])

  return (
    <Modal
      title="采集器更新日志"
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
        {/*<MarkdownPreview source={changelog} />*/}
        <div>
          {changelog.split('\n').map((line, index) => {
            return <div key={index}>{line}</div>
          })}
        </div>
      </div>
    </Modal>
  )
}
