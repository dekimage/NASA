import Link from "next/link";
import styles from "../styles/Home.module.css";
export default function Home() {
  return (
    <div className={styles.box}>
      <Link href="/apod">
        <div className={styles.link}> EXERCISE 1 - APOD</div>
      </Link>
      <Link href="/mars">
        <div className={styles.link}> EXERCISE 2 - MARS</div>
      </Link>
      <Link href="/neos">
        <div className={styles.link}> EXERCISE 3 - NEOS</div>
      </Link>
    </div>
  );
}
