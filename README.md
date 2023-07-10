# Quicklink - Quickly opens links

A program that helps you open links quickly

## Install

```bash
npm run install
```

## Usage

### How to use

default shortcut: `ctrl + alt + c`  
double shortcut to open setting tab(if you set any setting)

#### Setting file directory

##### windows

`%appdata%\\Roming\\quicklink`

##### mac

`~/library`

### Dev

dev.js finds an available port and runs react and electron windows.(Restarts when code's saved.)

```bash
npm run dev
```

###

### Build

build react and electron scripts

```bash
npm run build
```

### Start

start program

```bash
npm run start
```

### Release

release an executable file(must be builded first)

based by current platform

```bash
npm run release
```

windows

```bash
npm run release:win
```

mac

```bash
npm run release:mac
```

all

```bash
npm run release:all
```
