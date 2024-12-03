import { Editor } from '@monaco-editor/react'
import { useQuery } from '@tanstack/react-query'
import { Modal, Spin } from 'antd'
import { FC } from 'react'

import { fileApi } from '../../../api/file.ts'
import { QueryKey } from '../../../api/query-key.ts'

interface Props {
  filename: string
  open: boolean
  setOpen: (open: boolean) => void
}

export const IcdFileContentModal: FC<Props> = (props) => {
  const { filename, open, setOpen } = props

  // ----------------------------- State -----------------------------

  // ----------------------------- React-Query -----------------------------
  const icdContentQuery = useQuery({
    queryKey: [QueryKey.IcdFileContent, filename],
    queryFn: () => fileApi.getIcdContent(filename),
    enabled: !!filename
  })
  const icdContent = icdContentQuery.data?.data.data.content || ''

  // ----------------------------- Method -----------------------------
  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Modal
      cancelText={null}
      destroyOnClose={true}
      footer={null}
      open={open}
      title={filename}
      width={1200}
      onCancel={handleCancel}
    >
      <Spin spinning={icdContentQuery.isLoading}>
        <Editor
          defaultLanguage="xml"
          height="calc(100vh - 240px)"
          options={{
            readOnly: true
          }}
          value={icdContent}
        />
      </Spin>
    </Modal>
  )
}
