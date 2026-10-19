import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import portfolioProject from "../../Assets/Projects/portfolio_project.jpg";
import bookRecommendation from "../../Assets/Projects/book_recommendation.jpg";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={portfolioProject}
              isBlog={false}
              title="Portfolio Website"
              description="Designed and developed a responsive personal portfolio website to showcase projects, technical skills, achievements, and professional experience. Implemented structured project sections with detailed descriptions, feature highlights, and interactive navigation for easy content exploration. Added a contact/inquiry form and optimized the website layout for responsive viewing across desktop and mobile devices."
              ghLink="https://github.com/jatinmeghwal"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={bookRecommendation}
              isBlog={false}
              title="Book Recommendation Engine"
              description="Developed a Python-based recommendation engine that suggests books based on user preferences collected through an interactive questionnaire. Implemented data processing and preference-matching logic to generate personalized recommendations from a structured book dataset. Integrated recommendation results with relevant online sources, allowing users to explore suggested books and their details."
              ghLink="https://github.com/jatinmeghwal"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
