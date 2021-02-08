const Tile = Object.freeze({
  EMPTY: 0,
  WALL: 1,
  FLOOR: 2,
  CRATE: 4,
  LOCATION: 8,
  PLAYER: 16,
})

const run = ({ tiles, width, height }, tileWidth = 64, tileHeight = 64) => {
  let waitForRefresh = false

  document.onkeydown = event => {
    if (waitForRefresh) return

    const computeNextPosition = position => {
      switch (event.key) {
        case "ArrowUp":
          return Math.max(position - width, 0)
        case "ArrowDown":
          return Math.min(position + width, width * height - 1)
        case "ArrowLeft":
          return Math.max(position - 1, 0)
        case "ArrowRight":
          return Math.min(position + 1, width * height - 1)
        default:
          return position
      }
    }

    const previousPlayerPosition = tiles.findIndex(tile => tile & Tile.PLAYER)
    const nextPlayerPosition = computeNextPosition(previousPlayerPosition)

    if (
      nextPlayerPosition === previousPlayerPosition ||
      tiles[nextPlayerPosition] & Tile.WALL
    )
      return

    if (tiles[nextPlayerPosition] & Tile.CRATE) {
      const nextCratePosition = computeNextPosition(nextPlayerPosition)

      if (
        nextCratePosition === nextPlayerPosition ||
        tiles[nextCratePosition] & Tile.WALL ||
        tiles[nextCratePosition] & Tile.CRATE
      )
        return

      tiles[nextPlayerPosition] ^= Tile.CRATE
      tiles[nextCratePosition] |= Tile.CRATE
    }

    tiles[previousPlayerPosition] ^= Tile.PLAYER
    tiles[nextPlayerPosition] |= Tile.PLAYER

    waitForRefresh = true
  }

  const spritesheet = new Image()
  spritesheet.src = "spritesheet.png"

  const canvas = document.getElementById("sokoban")
  const context = canvas.getContext("2d")

  canvas.width = width * tileWidth
  canvas.height = height * tileHeight

  setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] === Tile.EMPTY) continue

      const x = (i % width) * tileWidth
      const y = Math.floor(i / width) * tileHeight

      if (tiles[i] & Tile.WALL) {
        context.drawImage(
          spritesheet,
          6 * tileWidth,
          7 * tileHeight,
          tileWidth,
          tileHeight,
          x,
          y,
          tileWidth,
          tileHeight
        )

        continue
      }

      if (tiles[i] & Tile.FLOOR) {
        context.drawImage(
          spritesheet,
          11 * tileWidth,
          6 * tileHeight,
          tileWidth,
          tileHeight,
          x,
          y,
          tileWidth,
          tileHeight
        )
      }

      if (tiles[i] & Tile.CRATE) {
        context.drawImage(
          spritesheet,
          6 * tileWidth,
          tiles[i] & Tile.LOCATION ? tileHeight : 0,
          tileWidth,
          tileHeight,
          x,
          y,
          tileWidth,
          tileHeight
        )

        continue
      }

      if (tiles[i] & Tile.LOCATION) {
        context.drawImage(
          spritesheet,
          12 * tileWidth,
          tileHeight,
          tileWidth,
          tileHeight,
          x,
          y,
          tileWidth,
          tileHeight
        )
      }

      if (tiles[i] & Tile.PLAYER) {
        context.drawImage(
          spritesheet,
          0,
          5 * tileHeight,
          tileWidth,
          tileHeight,
          x,
          y,
          tileWidth,
          tileHeight
        )
      }
    }

    waitForRefresh = false
  }, 100)
}

run({
  tiles: [
    Tile.EMPTY,
    Tile.EMPTY,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.EMPTY,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.FLOOR,
    Tile.FLOOR,
    Tile.FLOOR,
    Tile.WALL,
    Tile.EMPTY,
    Tile.WALL,
    Tile.FLOOR | Tile.LOCATION,
    Tile.FLOOR | Tile.PLAYER,
    Tile.FLOOR | Tile.CRATE,
    Tile.FLOOR,
    Tile.FLOOR,
    Tile.WALL,
    Tile.EMPTY,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.FLOOR,
    Tile.FLOOR | Tile.CRATE,
    Tile.FLOOR | Tile.LOCATION,
    Tile.WALL,
    Tile.EMPTY,
    Tile.WALL,
    Tile.FLOOR | Tile.LOCATION,
    Tile.WALL,
    Tile.WALL,
    Tile.FLOOR | Tile.CRATE,
    Tile.FLOOR,
    Tile.WALL,
    Tile.EMPTY,
    Tile.WALL,
    Tile.FLOOR,
    Tile.WALL,
    Tile.FLOOR,
    Tile.FLOOR | Tile.LOCATION,
    Tile.FLOOR,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.FLOOR | Tile.CRATE,
    Tile.FLOOR,
    Tile.FLOOR | Tile.CRATE | Tile.LOCATION,
    Tile.FLOOR | Tile.CRATE,
    Tile.FLOOR | Tile.CRATE,
    Tile.FLOOR | Tile.LOCATION,
    Tile.WALL,
    Tile.WALL,
    Tile.FLOOR,
    Tile.FLOOR,
    Tile.FLOOR,
    Tile.FLOOR | Tile.LOCATION,
    Tile.FLOOR,
    Tile.FLOOR,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
    Tile.WALL,
  ],
  width: 8,
  height: 9,
})
