export const ORDER_FORM_ID = 'order-form'
export const ORDER_FORM_HASH = `#${ORDER_FORM_ID}`
export const ORDER_FORM_LINK = `/${ORDER_FORM_HASH}`

function getOrderFormScrollTop(target) {
  const { top } = target.getBoundingClientRect()
  const scrollMarginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0

  return Math.max(0, window.scrollY + top - scrollMarginTop)
}

export function scrollToOrderForm({ updateHash = true } = {}) {
  const target = document.getElementById(ORDER_FORM_ID)

  if (!target) {
    return false
  }

  window.scrollTo({
    top: getOrderFormScrollTop(target),
    behavior: 'smooth',
  })

  if (updateHash) {
    const nextUrl = `${window.location.pathname}${window.location.search}${ORDER_FORM_HASH}`
    const historyMethod = window.location.hash === ORDER_FORM_HASH ? 'replaceState' : 'pushState'

    window.history[historyMethod](null, '', nextUrl)
  }

  return true
}

export function handleOrderFormLinkClick(event) {
  if (!document.getElementById(ORDER_FORM_ID)) {
    return
  }

  event.preventDefault()
  scrollToOrderForm()
}
