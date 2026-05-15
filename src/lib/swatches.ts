export const SWATCHES: Record<string, Record<string, string>> = {
  finish: {
    oak: '#C8A97A',
    walnut: '#6B4226',
    ebony: '#1C1008',
  },
  fabric: {
    linen: '#D9CCBA',
    velvet: '#7C6D8A',
    boucle: '#E8E0D0',
    performance: '#B0B8C1',
    leather: '#8B5E3C',
  },
  legs: {
    oak: '#C8A97A',
    walnut: '#6B4226',
    'black-metal': '#2A2A2A',
  },
  seat: {
    linen: '#D9CCBA',
    velvet: '#7C6D8A',
    leather: '#8B5E3C',
  },
  frame: {
    oak: '#C8A97A',
    walnut: '#6B4226',
    black: '#2A2A2A',
  },
}

export function getSwatchColor(groupName: string, value: string): string | undefined {
  const key = groupName.toLowerCase().replace(/\s+/g, '')
  return SWATCHES[key]?.[value]
}

/** Returns the best overlay color for the image tint based on selected options.
 *  Prefers upholstery groups (fabric, seat) over structural ones (legs, frame). */
export function getOverlayColor(
  options: { name: string; type: string }[],
  selected: Record<string, string>
): string | null {
  const priority = ['fabric', 'seat', 'upholstery', 'finish', 'frame', 'legs']

  for (const key of priority) {
    const group = options.find(
      (g) => g.type === 'swatch' && g.name.toLowerCase().replace(/\s+/g, '') === key
    )
    if (group) {
      const color = getSwatchColor(group.name, selected[group.name])
      if (color) return color
    }
  }

  // Fallback: first swatch group with any matching color
  for (const group of options) {
    if (group.type !== 'swatch') continue
    const color = getSwatchColor(group.name, selected[group.name])
    if (color) return color
  }

  return null
}
