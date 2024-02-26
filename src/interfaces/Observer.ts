interface Observer {
  update(msg: string, data: JSON): void
}

export default Observer
