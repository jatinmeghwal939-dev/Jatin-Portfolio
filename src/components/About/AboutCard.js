import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi everyone! I'm <span className="purple">Jatin Meghwal</span>{" "}
            from <span className="purple">Jaipur, India</span>.
            <br />
            I'm currently pursuing a{" "}
            <span className="purple">B.Tech in Chemical Engineering</span> at{" "}
            <span className="purple">
              Malaviya National Institute of Technology, Jaipur
            </span>
            .
            <br />
            My Roll No. is <span className="purple">2024UCH1546</span> and my
            current CGPA is <span className="purple">6.53/65.3</span>.
            <br />
            <br />
            Apart from coding, some other activities that I love to do:
          </p>

          <ul>
            <li className="about-activity">
              <ImPointRight /> Participating in Debate Club 🎤
            </li>
            <li className="about-activity">
              <ImPointRight /> Video Editing 🎬
            </li>
            <li className="about-activity">
              <ImPointRight /> Problem Solving & Analytical Thinking 🧩
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p>
          <footer className="blockquote-footer">Jatin</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
