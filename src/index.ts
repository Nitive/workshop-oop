import axios from 'axios'
import { promises as fs } from 'fs'
import { App } from './app'
import { Stdout } from './out/stdout'

const world = {
  fs,
  network: axios,
  out: new Stdout(),
}
const app = new App(world)

app.run(process.argv)
  .catch(console.error)
