import type { ComponentProp } from '../../data/components'

/** Website documentation only; never included in distributed component source. */
export function PropsReference({ props }: { props: ComponentProp[] }) {
  return <div className="props-reference">
    <div className="props-reference-heading"><h4>Props</h4><span>{props.length} {props.length === 1 ? 'property' : 'properties'}</span></div>
    <div className="props-reference-surface">
      <table className="props-reference-table">
        <caption className="sr-only">Component properties, types, defaults and descriptions</caption>
        <thead><tr><th scope="col">Property</th><th scope="col">Type &amp; description</th><th scope="col">Default</th></tr></thead>
        <tbody>{props.map(prop=><tr key={prop.name}>
          <th scope="row" className="prop-name"><code>{prop.name}</code></th>
          <td className="prop-details"><code className="prop-signature">{prop.type}</code><p>{prop.description}</p></td>
          <td className="prop-default"><span className="prop-default-label">Default</span>{prop.defaultValue !== undefined ? <code>{prop.defaultValue}</code> : <span className="prop-no-default" aria-label="No default value">—</span>}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>
}
