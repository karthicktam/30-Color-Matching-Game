import React, { useState } from "react";
import Sketch from "react-p5";
import "./styles.css";

const colors = {
  red: "#E53E3E",
  blue: "#4299E1"
};

let ballSpeed = 2;
let score = 0;

// used to place the middle balls
let topPosition;
let bottomPosition;
const middleOffSet = 20;

let ballTop;
let ballBottom;

class Ball extends React.Component {
  constructor(props) {
    super(props);
    const { x, y, dy, p5, col } = props;
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(0, dy || 0);
    this.size = 15;
    this.col = col || colors.red;
  }

  update(p5) {
    this.pos.add(this.vel);
  }

  draw(p5) {
    p5.fill(this.col);
    p5.noStroke();
    p5.circle(this.pos.x, this.pos.y, this.size * 2);
  }

  checkHit(p5, ball) {
    const { removeBall, createRandomFallingBall } = this.props;
    const d = p5.dist(ball.pos.x, ball.pos.y, this.pos.x, this.pos.y);
    if (d < this.size * 2) {
      if (this.col === ball.col) {
        score++;
        ballSpeed += 0.2;
      } else {
        score = 0;
        ballSpeed = 2;
      }

      removeBall(this);
      createRandomFallingBall(p5);
    }
  }
}

export default function App() {
  const [enemyBalls, setEnemyBalls] = useState([]);

  const createRandomFallingBall = (p5) => {
    const ballCommonOptions = {
      p5: p5,
      x: p5.width / 2,
      col: Math.random < 0.5 ? colors.red : colors.blue,
      removeBall,
      createRandomFallingBall
    };

    const ballTopOptions = {
      y: 0,
      dy: ballSpeed,
      ...ballCommonOptions
    };

    const ballBottomOptions = {
      y: p5.height,
      dy: -ballSpeed,
      ...ballCommonOptions
    };

    const ball = new Ball(
      Math.random() < 0.5 ? ballTopOptions : ballBottomOptions
    );
    setEnemyBalls([...enemyBalls, ball]);
  };

  const removeBall = (ball) => {
    setEnemyBalls(enemyBalls.filter((b) => b !== ball));
  };

  const setup = (p5) => {
    p5.createCanvas(350, 600);

    // set positions
    topPosition = p5.height / 2 - middleOffSet;
    bottomPosition = p5.height / 2 + middleOffSet;

    // create middle balls
    ballTop = new Ball({
      p5: p5,
      x: p5.width / 2,
      y: topPosition,
      col: colors.red,
      removeBall,
      createRandomFallingBall
    });
    ballBottom = new Ball({
      p5: p5,
      x: p5.width / 2,
      y: bottomPosition,
      col: colors.blue,
      removeBall,
      createRandomFallingBall
    });

    createRandomFallingBall(p5);
  };

  const draw = (p5) => {
    p5.background(51);

    ballTop.draw(p5);
    ballBottom.draw(p5);

    enemyBalls.forEach((ball) => {
      ball.checkHit(p5, ballTop);
      ball.checkHit(p5, ballBottom);
      ball.update(p5);
      ball.draw(p5);
    });

    p5.fill(255);
    p5.textSize(16);
    p5.text(`Score: ${score}`, p5.width - 75, 25);
  };

  const mousePressed = () => {
    let temp = ballTop.pos.y;
    ballTop.pos.y = ballBottom.pos.y;
    ballBottom.pos.y = temp;
  };

  return (
    <div className="app">
      <h2>Color Matching Game!</h2>
      <p>Click on the screens to switch the colors</p>
      <small>
        (<a href="https://twitter.com/karthicktamil17">Tell me</a> how far you
        got)
      </small>
      <Sketch setup={setup} draw={draw} mousePressed={mousePressed} />
    </div>
  );
}
