import React from "react";
import "./Policies.scss";
import { useParams } from "react-router-dom";
import jsonData from "../../services/data.json";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Policies = () => {
  const { slug } = useParams();

  const {
    termsAndConditions,
    shippingPolicies,
    privacyPolicies,
    refundPolicies,
  } = jsonData;

  const policyMap = {
    terms: termsAndConditions,
    shipping: shippingPolicies,
    privacy: privacyPolicies,
    refund: refundPolicies,
  };

  const data = policyMap[slug] || termsAndConditions;

  return (
    <section className="terms-and-policies-main">
      <div className="terms-and-policies-header">
        <button
          onClick={() => window.history.back()}
          className="terms-and-policies-header__lhs"
        >
          <ArrowBackIcon />
        </button>
        <div className="terms-and-policies-header__rhs">
          <h1>{data.heading}</h1>
          <p>{data.subHeading}</p>
        </div>
      </div>
      <ul className="terms-and-policies-body">
        {data.sections.map((section) => (
          <li key={section.title}>
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Policies;
