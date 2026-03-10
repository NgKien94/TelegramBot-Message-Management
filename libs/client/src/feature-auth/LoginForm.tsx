import { Input } from '@message-management/shared/ui';
import { useNavigate } from 'react-router-dom'
import { loginFormSchema, LoginFormValues } from '../apis/auth.validation';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { login } from '../apis/auth.service';
import { ApiErrorForClient } from '@message-management/types';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify'

const initialValue: LoginFormValues = {
  email: '',
  password: ''
}

export function LoginForm() {
  const navigate = useNavigate()

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: initialValue
  })

    const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success('Login successfully')
      navigate('/')
    },
    onError: (error: AxiosError<ApiErrorForClient>) => {
      console.log('Error: ', error)
      toast.error(error.response?.data.error.message || 'Login failed')
    }
  })

  const handleOnSubmitForm = (data: LoginFormValues) => {
    loginMutation.mutate({ email: data.email, password: data.password })
  }

  return (
    <form className="w-3/4 flex flex-col justify-center items-center gap-y-3"
    method='POST'
    onSubmit={(event) => {
            event.preventDefault()
            handleSubmit(handleOnSubmitForm)()
      }}
      >
      <Input label="Email" type="email" {...register('email')} errorMessage={errors.email?.message} />
      <Input label="Password" type="password" {...register('password')} errorMessage={errors.password?.message}/>
      <button className="block w-full mt-2 rounded px-3 py-2 bg-[var(--primary-color)] text-white hover:opacity-80 transition-all duration-200 ease-linear">
        Login
      </button>
    </form>
  );
}
