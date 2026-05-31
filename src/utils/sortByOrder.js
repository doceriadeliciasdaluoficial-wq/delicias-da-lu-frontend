export function sortByOrder(items = []) {
  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftOrder = Number(left.item?.order)
      const rightOrder = Number(right.item?.order)
      const leftHasOrder = Number.isFinite(leftOrder)
      const rightHasOrder = Number.isFinite(rightOrder)

      if (leftHasOrder && rightHasOrder && leftOrder !== rightOrder) {
        return leftOrder - rightOrder
      }

      if (leftHasOrder !== rightHasOrder) {
        return leftHasOrder ? -1 : 1
      }

      return left.index - right.index
    })
    .map(({ item }) => item)
}

export default sortByOrder