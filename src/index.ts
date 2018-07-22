import axios from 'axios'
import { promises as fs } from 'fs'
import { App } from './app'
import { Stdout } from './out/stdout'

const sources = {
  fs,
  network: axios,
  out: new Stdout(),
}
const app = new App(sources)

app.run(process.argv)
  .catch(console.error)
