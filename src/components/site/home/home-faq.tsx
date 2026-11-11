import { questions } from './home-content'

export function HomeFaq() {
  return (
    <section className="home-faq" aria-labelledby="faq-title"><div className="home-faq-inner"><h2 id="faq-title">Frequently asked questions</h2><div>{questions.map(([question,answer])=><details key={question}><summary>{question}<span className="home-faq-symbol" aria-hidden="true" /></summary><div className="home-faq-answer"><p>{answer}</p></div></details>)}</div></div></section>
  )
}
