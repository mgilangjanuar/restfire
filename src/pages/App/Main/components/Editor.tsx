import React from 'react'
import AceEditor from 'react-ace'
import { useThemeSwitcher } from 'react-css-theme-switcher'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-xml'
import 'ace-builds/src-noconflict/mode-plain_text'
import 'ace-builds/src-noconflict/theme-vibrant_ink'
import 'ace-builds/src-noconflict/theme-eclipse'

interface Props {
  mode?: string,
  onChange?: (body: string) => any,
  value?: string,
  defaultValue?: string,
  options?: any
}

const Editor: React.FC<Props> = ({ mode, onChange, value, defaultValue, options }) => {
  const { currentTheme } = useThemeSwitcher()

  return <AceEditor
    mode={mode}
    theme={currentTheme === 'light' ? 'eclipse' : 'vibrant_ink'}
    className="aceEditor"
    fontSize={12.5}
    width="100%"
    showPrintMargin={true}
    showGutter={true}
    highlightActiveLine={false}
    onChange={onChange}
    value={value}
    defaultValue={defaultValue}
    setOptions={{
      maxLines: 15,
      minLines: 10,
      wrap: true,
      tabSize: 2,
      showPrintMargin: false,
      useWorker: false,
      ...options
    }}
  />
}

export default Editor