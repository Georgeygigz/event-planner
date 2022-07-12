import React, { useState, useEffect, useRef } from "react";
import { Layout, Form, Select, Input, Button, Row, Col } from "antd";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import api from "../api";

const SubString = () => {
  const [form] = Form.useForm();
  const [isDone, setIsDone] = useState(false);
  const [words, setWords] = useState([
    "INFORMATION",
    "KITCHEN",
    "BACKGROUND",
    "ATMOSPHERE"
  ]);
  const [wordSolutions, setWordSolutions] = useState([]);
  const [solutionObj, setSolutionObj] = useState({
    INFORMATION: [
      "IN",
      "FOR",
      "INFO",
      "FORM",
      "OR",
      "ON",
      "FORMAT",
      "INFORM",
      "AT",
      "MAT",
      "ION",
    ],
    KITCHEN: [
      "KIT","IT","ITCH","HEN","HE"
    ],
    BACKGROUND: [
      "BACK","GROUND","ROUND"
    ],
    ATMOSPHERE: [
      "SPHERE","HERE","HER","AT"
    ],
    DICTIONARY: [
      "DICTION","ION","ON"
    ],
  });
  const [questionNo, setQuestionNo] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [scoreList, setScoreList] = useState([]);
  const [chars, setChar] = useState(["M", "A", "N"]);
  const [selectedWord, setSelectedWord] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFalse, setIsFalse] = useState(false);
  const selectedLetterArray = useRef();
  const [subString, setSubString] = useState("");

  useEffect(() => {
    let arrSplit = words[0].split("");
    arrSplit = arrSplit.map((char, idx) => {
      return {
        char: char,
        picked: false,
        id: idx,
      };
    });
    setChar(arrSplit);
    setQuestionNo(1);;
    setWordSolutions(solutionObj[words[0]])
    setTotalScore(solutionObj[words[0]].length)
  }, []);

  const getWords = () => {
    api
      .get("/")
      .then((res) => {
        console.log("res >>>>", res.data);
        setWords(res.data.words);
      })
      .catch((err) => {
        console.log("res >>>>", err);
      });
  };

  const saveWord = (word) => {
    api
      .post("/saveword", { word: word })
      .then((res) => {
        console.log("res>>>>>>>>>>>>", res.data);
      })
      .catch((err) => {
        console.log("res>>>>>>>>>>>>", err);
      });
  };

  const handleNextWord = () => {
    setIsDone(false);
    let arrayScores = localStorage.getItem('scores') || [];
    console.log('arrayScores', arrayScores)
    let payload = {
      question: questionNo,
      score: selectedWord.length,
      total: totalScore
    }
    arrayScores = [
      ...arrayScores,
      payload
    ]
    localStorage.setItem('scores', arrayScores)
    let arrSplit = words[questionNo].split("");
    arrSplit = arrSplit.map((char, idx) => {
      return {
        char: char,
        picked: false,
        id: idx,
      };
    });
    setChar(arrSplit);
    setQuestionNo((questionNo+1));;
    setWordSolutions(solutionObj[words[questionNo]])
    setScoreList([]);
    setTotalScore(solutionObj[words[questionNo]].length)
  }

  const handleDone = () => {
    setIsDone(true);
    setIsSuccess(false);
  }

  const onCharClick = (char, idx) => {
    let selectIdx = idx;
    let arr = chars;
    let selectedArr = [...selectedWord];
    setIsFalse(false)
    setIsSuccess(false)
    if (char.picked) {
      arr = arr.map((newChar, idex) => {
        if (idex >= selectIdx) {
          newChar.picked = newChar.picked ? !newChar.picked : newChar.picked;
          return newChar;
        } else {
          return newChar;
        }
      });
      setChar(arr);
      let newArr = [];
      arr.forEach((newChar, idex) => {
        if (newChar.picked) {
          newArr.push(newChar);
        }
      });
      selectedArr = newArr;
    }

    if (
      (idx === selectedArr[0]?.id - 1 ||
        idx === selectedArr[selectedArr.length - 1]?.id + 1 ||
        selectedArr.length === 0) &&
      !char.picked
    ) {
      char.picked = !char.picked;
      char.id = idx;
      arr.splice(idx, 1, char);
      setChar(arr);
      selectedArr.push(char);
      selectedArr.sort((a, b) => a.id - b.id);
    }
    setSelectedWord(selectedArr);
  };

  const handleClearSelectedWord = () => {
    let arrSplit = chars.map((char, idx) => {
      return {
        char: char.char,
        picked: false,
        id: char.id,
      };
    });
    setChar(arrSplit);
    setSelectedWord([]);
  };

  const handleSubmitSelectedWord = () => {
    console.log("selectedWord", selectedWord);
    let submittedWord = selectedWord.map((word, idx) => {
      return word.char
    });
    submittedWord = submittedWord.join('');
    let correctAnswers = [...scoreList];
    console.log("wordSolutions", wordSolutions);
    let answer = wordSolutions.indexOf(submittedWord)
    console.log("answer", answer); 
    if (answer >= 0 && !scoreList.includes(submittedWord)) {
      console.log("submittedWord", submittedWord);
      wordSolutions.splice(answer, 1)
      submittedWord = {
        char: submittedWord,
        picked: false,
        id: answer,
      };
      console.log("submittedWord", submittedWord);
      setIsSuccess(true)
      handleClearSelectedWord();
      correctAnswers.push(submittedWord)
    } else if(answer < 0){
      setIsFalse(true)
      handleClearSelectedWord();
    }
    setScoreList(correctAnswers)

  };

  const renderCharacters = (word) => {
    let arrSplit = word.split("");
    arrSplit = arrSplit.map((char, idx) => {
      return {
        char: char,
        picked: false,
        id: idx,
      };
    });
    setChar(arrSplit);
    setWordSolutions(solutionObj[word])
    setTotalScore(solutionObj[word].length)
    // setChar(splittedWord);
    console.log(word.split(""));
  };

  const addWords = () => {
    const word = form.getFieldValue("word");
    setWords((prevItems) => [...prevItems, word]);

    saveWord(word);
    form.resetFields();
  };

  let wordOptions = words.map((word, idx) => (
    <Select.Option key={idx} value={word}>
      {word}
    </Select.Option>
  ));

  const renderWordsSelection = (
    <div>
      <Form
        form={form}
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 25,
        }}
        layout="vertical"
        name="word-selection"
      >
        <div className="substring-wrapper">
          <Form.Item
            name="word"
            label="Enter Word"
            className="word-selection-form"
            rules={[{ type: "string" }]}
          >
            <div className="words-input">
              <Input />
              <Button type="primary" htmlType="submit" onClick={addWords}>
                Add
              </Button>
            </div>
          </Form.Item>
          <Form.Item
            name="words"
            label="Select Word"
            className="word-selection-form"
            rules={[
              {
                required: true,
                message: "Please select county",
              },
            ]}
          >
            <Select onSelect={renderCharacters}> {wordOptions} </Select>
          </Form.Item>
        </div>
      </Form>
    </div>
  );

  return (
    <div>
      <NavBar />
      <Layout>
        <SideBar menu={renderWordsSelection} />
        <Layout.Content
          style={{
            padding: "3rem 0 0 0",
          }}
        >
          <Row justify="start" align="middle" wrap={true}>
            <Col
              xs={{ span: 6, offset: 0 }}
              sm={{ span: 6, offset: 0 }}
              style={{
                display: "flex",
                flexDirection: 'column',
                alignItems: 'start',
              }}
            >
              <h2>Q {questionNo}</h2>
              <h3>Score: {scoreList.length} /{totalScore}</h3>
            </Col>
            <Col
              xs={{ span: 18 }}
              sm={{ span: 18 }}
              md={{ span: 12, offset: 0 }}
            >
              <Row justify="start">
              {(selectedWord || !isDone) &&
              selectedWord.map((char, idx) => (
                <Col
                  xs={{ span: 2 }}
                  sm={{ span: 1 }}
                  md={{ span: 1, offset: 0 }}
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#000",
                    color: "white",
                    margin: "1rem .1rem",
                    padding: "0.8rem 1.6rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => onCharClick(char, idx)}
                >
                  {char.char}
                </Col>
              ))}
              </Row>
            </Col>    
            { isSuccess && <Col
               xs={{ span: 6,  }}
               sm={{ span: 6,  }}
               lg={{ span: 3, }}
               style={{
                display: "flex",
                fontSize: '2rem',
                flexDirection: "row-reverse",
              }}
            >
              &#128077;&#127997;&#9989;
            </Col>}
            { isFalse && <Col
                xs={{ span: 6, }}
                sm={{ span: 6, }}
               lg={{ span: 3, }}
               style={{
                display: "flex",
                fontSize: '2rem',
                flexDirection: "row-reverse",
              }}
              >
                &#128078;&#127997; &#9940;
              </Col>}
          </Row>
          <Row justify="start" wrap>
            {/* {wordChars} */}
              {!isDone && chars.map((char, idx) =>
                char.picked ? (
                  <Col
                    xs={{ span: 2 }}
                    sm={{ span: 2 }}
                    md={{ span: 2, offset: 0 }}
                    lg={{ span: 1, offset: 0 }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "#000",
                      color: "white",
                      margin: "1rem .1rem",
                      padding: "0.8rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    key={idx}
                    onClick={() => onCharClick(char, idx)}
                  >
                    {char.char}
                  </Col>
                ) : (
                  <Col
                    key={idx}
                    xs={{ span: 2 }}
                    sm={{ span: 2 }}
                    md={{ span: 2, offset: 0 }}
                    lg={{ span: 1, offset: 0 }}
                    style={{
                      backgroundColor: "orange",
                      margin: "1rem .1rem",
                      padding: "0.8rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onClick={() => onCharClick(char, idx)}
                  >
                    {char.char}
                  </Col>  
                )
              )}
          </Row>

          {/* Clear and submit buttons row */}
          <Row>
            <Col
               xs={{ span: 6, offset: 0 }}
               md={{ span: 3, offset: 0 }}
              style={{
                display: "flex",
                flexDirection: "col-reverse",
                alignItems: "center",
              }}
            >
              {selectedWord.length > 0 && (
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => handleClearSelectedWord()}
                >
                  Clear
                </Button>
              )}
            </Col>
            <Col
               xs={{ span: 6 }}
               md={{ span: 3 }}
              style={{
                display: "flex",
                flexDirection: "col-reverse",
                alignItems: "center",
                margin: '0 .5rem'
              }}
            >
              {selectedWord.length > 0 && (
                <Button
                  block
                  size="large"
                  type="primary"
                  onClick={() => handleSubmitSelectedWord()}
                >
                  Submit
                </Button>
              )}
            </Col>
          </Row>
          <Row justify="start">
         {(scoreList.length > 0) && <span className="" style={{
            fontSize: '0.8rem',
            marginTop: '2rem',
            fontWeight: 500
          }}>SUBMITTED WORDS</span>}
         </Row>
          <Row justify="start" wrap={true}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 14, offset: 0 }}
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {scoreList &&
                scoreList.map((char, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#45cb85",
                      color: "white",
                      fontWeight: 'bolder',
                      margin: "1rem .1rem",
                      padding: "0.8rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onClick={() => onCharClick(char, idx)}
                  >
                    {char.char}
                  </div>
                ))}
            </Col> 
          </Row>
         <Row>
         {(isDone && wordSolutions.length > 0) && <span className="" style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            marginTop: '2rem',
          }}>REMAINING WORDS</span>}
         </Row>
          {isDone &&
            <Row justify="start" wrap={true}>
              
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 14, offset: 0 }}
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
               {wordSolutions &&
                wordSolutions.map((char, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "cyan",
                      color: "black",
                      fontWeight: 'bolder',
                      margin: "1rem .1rem",
                      padding: "0.8rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onClick={() => onCharClick(char, idx)}
                  >
                    {char}
                  </div>
                ))}
              </Col></Row>
          }
          <Row>
          <Col
               xs={{ span: 6 }}
               md={{ span: 3 }}
               style={{
                display: "flex",
                flexDirection: "col-reverse",
                alignItems: "center",
              }}
            >
              {(scoreList.length > 0 && !isDone) && (
                <Button
                  block
                  size="large"
                  type="primary"
                  onClick={() => handleDone()}
                >
                  Done
                </Button>
              )}
               {(scoreList.length > 0 && isDone) && (
                <Button
                  block
                  size="large"
                  type="primary"
                  onClick={() => handleNextWord()}
                >
                  Next Word
                </Button>
              )}
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </div>
  );
};

export default SubString;
