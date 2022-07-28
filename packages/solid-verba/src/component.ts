import {JSXElement as JsxElement} from 'solid-js'

export {Component, onMount, onCleanup} from 'solid-js'
export {JsxElement}

export type WithClass = {class?: string}
export type WithChildren = {children: JsxElement}
export type Container = WithClass & WithChildren

// todo:
// export function component() {}

export function classes(props: WithClass, base?: string) {
  return `${base || ''} ${props.class || ''}`
}
