interface FormProps {
  onSubmit: any
  children: any
}

export const Form = (props: FormProps) => {
  const { onSubmit, children } = props
  return (
    <form className="mt-4 space-y-4" onSubmit={onSubmit} noValidate>
      {children}
    </form>
  )
}
