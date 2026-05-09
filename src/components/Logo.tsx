import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import logoClaro from '../assets/camisa9_claro.png'
import logoEscuro from '../assets/camisa9_escuro.png'

type LogoSize = 'xs' | 'sm' | 'md' | 'lg'

const sizes: Record<LogoSize, string> = {
  xs: 'h-24',
  sm: 'h-32',
  md: 'h-40',
  lg: 'h-56',
}

interface LogoProps {
  size?: LogoSize
  href?: string
  className?: string
}

export function Logo({ size = 'sm', href = '/', className = '' }: LogoProps) {
  const { theme } = useTheme()
  const src = theme === 'dark' ? logoEscuro : logoClaro

  return (
    <Link to={href} className={`inline-flex items-center shrink-0 ${className}`}>
      <img src={src} alt="Camisa 9" className={`${sizes[size]} w-auto object-contain`} />
    </Link>
  )
}
