import Head from "next/head";
import Layout from "../components/layout";
import BMICalculator from "../components/BMICalculator";

export default function BMICalculatorPage() {
  return (
    <Layout>
      <Head>
        <title>BMI Calculator | Calculator Hub</title>
        <meta
          name="description"
          content="Fast, clean BMI calculator with metric and imperial units. Enter height and weight to get your Body Mass Index instantly."
        />
      </Head>
      <BMICalculator />
    </Layout>
  );
}
