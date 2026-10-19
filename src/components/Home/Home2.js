import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              I'm a B.Tech student in{" "}
              <i>
                <b className="purple">Chemical Engineering</b>
              </i>{" "}
              at Malaviya National Institute of Technology, Jaipur, passionate
              about building software solutions that make an impact.
              <br />
              <br />
              I'm proficient in
              <i>
                <b className="purple">
                  {" "}
                  C++, Python, and JavaScript{" "}
                </b>
              </i>
              — and enjoy working on both web development and data-driven
              projects.
              <br />
              <br />
              My key areas of interest include developing
              <i>
                <b className="purple">
                  {" "}
                  Web Applications and Data Science Solutions,{" "}
                </b>
              </i>
              and I love exploring new technologies to solve real-world problems.
              <br />
              <br />
              Whenever possible, I love building projects with{" "}
              <b className="purple">Python </b> and modern web technologies like{" "}
              <i>
                <b className="purple">HTML, CSS,</b> and{" "}
                <b className="purple">JavaScript</b>.
              </i>
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
