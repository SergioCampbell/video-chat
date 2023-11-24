import React from 'react'

interface Props {
  children: React.ReactNode;
}

export const Options = ({children}: Props) => {
  return (
    <div>Options
      {children}
    </div>
  )
}
