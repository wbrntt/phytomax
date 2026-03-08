export const ORDER_FORM_ID = 'order-form'
export const ORDER_FORM_HASH = `#${ORDER_FORM_ID}`
export const ORDER_FORM_LINK = `/${ORDER_FORM_HASH}`

export function scrollToOrderForm({ updateHash = true } = {}) {
  const target = document.getElementById(ORDER_FORM_ID)

  if (!target) {
    return false
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (updateHash) {
    const nextUrl = `${window.location.pathname}${window.location.search}${ORDER_FORM_HASH}`
    const historyMethod = window.location.hash === ORDER_FORM_HASH ? 'replaceState' : 'pushState'

    window.history[historyMethod](null, '', nextUrl)
  }

  return true
}

export function handleOrderFormLinkClick(event) {
  if (!scrollToOrderForm()) {
    return
  }

  event.preventDefault()
}
