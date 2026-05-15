import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Settings = Record<string, string>

const DEFAULTS: Settings = {
  hero_line1: 'Não é só camisa.',
  hero_line2: 'É presença.',
  hero_subtitle: 'Camisas de futebol com estética streetwear. Para quem vive o jogo dentro e fora das quatro linhas.',
  hero_cta1: 'Ver Camisas',
  hero_cta2: 'Chamar no WhatsApp',
  hero_image_url: '',
  topbar_left: 'Frete grátis para todo o Brasil acima de R$199',
  topbar_right: 'Parcele em até 12x sem juros',
  promo_badge: 'Oferta Especial',
  promo_title: 'Até 40% Off',
  promo_subtitle: 'Nas camisetas selecionadas. Por tempo limitado!',
  promo_cta: 'Aproveitar Agora',
  whatsapp_number: '5521979604258',
  sobre_text: 'A Camisa 9 nasceu da paixão por futebol, cultura e estilo de rua.',
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_settings').select('key, value')
      .then(({ data }) => {
        if (data?.length) {
          const map: Settings = { ...DEFAULTS }
          data.forEach(row => { map[row.key] = row.value })
          setSettings(map)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading }
}
