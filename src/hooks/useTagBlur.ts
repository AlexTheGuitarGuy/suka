import { useEffect, useRef } from 'react'

const useTagBlur = (flag: boolean, setFlag: (newFlag: boolean) => void) => {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target) && flag) {
        setFlag(false)
      }
    }

    document.addEventListener('mouseup', handleClickOutside)
    return () => {
      document.removeEventListener('mouseup', handleClickOutside)
    }
  }, [ref, flag, setFlag])

  return ref
}

export default useTagBlur
