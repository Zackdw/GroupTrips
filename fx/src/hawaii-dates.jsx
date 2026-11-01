// Effects for docs/2027-04-hawaii/dates/. Loaded after the page's own script.
import AnimatedContent from './react-bits/AnimatedContent.jsx';
import ClickSpark from './react-bits/ClickSpark.jsx';
import GradientText from './react-bits/GradientText.jsx';
import SplitText from './react-bits/SplitText.jsx';
import { replaceWith, wrapInPlace } from './islands.jsx';
import { strawberryField } from './strawberries.js';

const $ = (sel) => document.querySelector(sel);

// Hero: shimmering "Fruit Gang" kicker and a letter-by-letter title.
// Deep berry reds read on the daytime sky; lighter pinks on the sunset (dark mode) sky.
const dark = matchMedia('(prefers-color-scheme: dark)').matches;
replaceWith($('.kicker'), (
  <p className="kicker">
    <GradientText
      colors={dark ? ['#ff8fa3', '#ffd6dd', '#ffb703', '#ff8fa3'] : ['#c8102e', '#e8394d', '#a4133c', '#c8102e']}
      animationSpeed={6}>Aloha, Fruit Gang</GradientText> 🍓
  </p>
));
replaceWith($('#hero-title'), (
  <SplitText
    text={'Hawaii 2027: when can you go?'}
    tag="h1"
    className="hero-title"
    textAlign="left"
    splitType="chars"
    delay={28}
    duration={0.9}
    trigger="load"
  />
));

// Cards rise into view as you scroll.
document.querySelectorAll('main > .card, main > section.card').forEach((card, i) => {
  wrapInPlace(card, (c) => (
    <AnimatedContent distance={60} duration={0.7} delay={i < 2 ? i * 0.12 : 0} scale={0.97} threshold={0.08}>
      {c}
    </AnimatedContent>
  ));
});

// Strawberry sparks on every tap or click.
wrapInPlace($('main'), (m) => (
  <ClickSpark sparkColor={['#ff4d6d', '#ff8fa3', '#ffd166']} sparkSize={9} sparkRadius={26} sparkCount={9} shape="star" duration={520}
    style={{ zIndex: 2 }}>
    {m}
  </ClickSpark>
));

strawberryField($('#strawberries'));
