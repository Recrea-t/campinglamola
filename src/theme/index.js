// Global style overrides
import styles from "./styles"

// Foundational style overrides
import colors from "./foundations/colors"
import shadows from "./foundations/shadows"
import typography from "./foundations/typography"

// Component style overrides
import Container from "./components/container"
import Accordion from "./components/accordion"
import Heading from "./components/heading"
import Button from "./components/button"
import Drawer from "./components/drawer"
import Tabs from "./components/tabs"
import Link from "./components/link"

const overrides = {
  styles,
  colors,
  shadows,
  ...typography,
  components: {
    Container,
    Accordion,
    Heading,
    Button,
    Drawer,
    CloseButton: { ...Button },
    Tabs,
    Link,
  },
}

export default overrides
