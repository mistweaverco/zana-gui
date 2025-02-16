<div align="center">

![Zana Logo](assets/logo.svg)

# zana-gui

[![Made with love](assets/badge-made-with-love.svg)](https://github.com/mistweaverco/zana-gui/graphs/contributors)
[![Electron](./assets/badge-electron.svg)](https://www.electronjs.org/)
[![TypeScript](./assets/badge-typescript.svg)](https://www.typescriptlang.org/)
[![Vite](./assets/badge-vite.svg)](http://vite.dev/)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/mistweaverco/zana-gui?style=for-the-badge)](https://github.com/mistweaverco/zana-gui/releases/latest)
[![Discord](assets/badge-discord.svg)](https://getzana.net/discord)

[Install](#install) • [Requirements](#requirements) • [What is working?](#what-is-working)

<p></p>

Zana GUI 🕹️. Zana 📦 aims to be like Mason.nvim 🧱, but maintained by the community 🌈.

Zana is swahili for "tools" or "tooling".

A package manager for Neovim.

Easily install and manage LSP servers, DAP servers, linters, and formatters.

<p></p>

Currently, Zana is in pre-alpha and under active development.

<p></p>

![demo](https://github.com/user-attachments/assets/5ccfdfb2-b44a-4a1d-a245-8ba3971a2af5)

<p></p>

</div>

## Install

Just head over to the [download page][download-page] or
grab it directtly from the [releases][releases-page].

## Requirements

Because Zana is a package manager for Neovim, you need to have Neovim installed.
Also, because Zana is a GUI, you need to have a graphical environment.

Besides that, we shell out to `npm`, `pip`, `cargo`, `go`, and `git` to install packages,
depending on the package type.

E.g. if you want to install `pkg:npm` packages, you need to have `npm` installed.

## What is working?

- [x] [registry](https://github.com/mistweaverco/zana-registry) updates on startup
- [x] Updates available for installed packages?
- [x] Filtering packages
- [x] Vim keymaps
- [x] Install `pkg:npm` packages
- [x] Update `pkg:npm` packages
- [ ] Install `pkg:github` packages
- [ ] Update `pkg:github` packages
- [x] Install `pkg:pypi` packages
- [x] Update `pkg:pypi` packages
- [x] Install `pkg:golang` packages
- [x] Update `pkg:golang` packages
- [ ] Install `pkg:cargo` packages
- [ ] Update `pkg:cargo` packages


[download-page]: https://getzana.net/#download
[releases-page]: https://github.com/mistweaverco/zana-client/releases/latest
