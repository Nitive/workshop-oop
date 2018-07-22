import { runInFakeWorld } from './run-in-fake-world'

describe('App', () => {
  it('rss out with network input should works', async() => {
    const sideEffects = await runInFakeWorld(
      app => app.run('node convert-feed --out rss https://ru.hexlet.io/lessons.rss'.split(' ')),
    )
    expect(sideEffects).toMatchSnapshot()
  })

  it('atom out should works', async() => {
    const sideEffects = await runInFakeWorld(
      app => app.run('node convert-feed --out atom https://ru.hexlet.io/lessons.rss'.split(' ')),
    )
    expect(sideEffects).toMatchSnapshot()
  })

  it('file input should works', async() => {
    const sideEffects = await runInFakeWorld(
      app => app.run('node convert-feed --out atom ./lessons.rss'.split(' ')),
    )
    expect(sideEffects).toMatchSnapshot()
  })

  it('reverse option should works', async() => {
    const sideEffects = await runInFakeWorld(
      app => app.run('node convert-feed --reverse --out atom ./lessons.rss'.split(' ')),
    )
    expect(sideEffects).toMatchSnapshot()
  })

  it('sort=date option should works', async() => {
    const sideEffects = await runInFakeWorld(
      app => app.run('node convert-feed --sort=date --out atom ./lessons.rss'.split(' ')),
    )
    expect(sideEffects).toMatchSnapshot()
  })

  it('limit option should works', async() => {
    const sideEffects = await runInFakeWorld(
      app => app.run('node convert-feed --limit=2 --out atom ./lessons.rss'.split(' ')),
    )
    expect(sideEffects).toMatchSnapshot()
  })

  it('sort, reverse and limit options should apply in right order', async() => {
    const sideEffects = await runInFakeWorld(
      app => app.run('node convert-feed sort=date --reverse --limit=2 --out atom ./lessons.rss'.split(' ')),
    )
    expect(sideEffects).toMatchSnapshot()
  })
})
