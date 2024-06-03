import React, {useState} from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast
} from '@chakra-ui/react';

import {DislikeIcon, LikeIcon} from './Icons';

const FeedbackWidget = () => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState({
    helpfulAspect: '',
    easeOfUse: '',
    additionalComments: '',
    issue: '',
    issueDetails: '',
    pageStructure: ''
  });

  const toast = useToast();

  const handleThumbsUp = () => {
    setFeedbackGiven(true);
    setThumbsUp(true);
    setShowSurvey(true);
  };

  const handleThumbsDown = () => {
    setFeedbackGiven(true);
    setThumbsUp(false);
    setShowSurvey(true);
  };

  const handleInputChange = e => {
    const {name, value} = e.target;
    setSurveyResponses(prevResponses => ({
      ...prevResponses,
      [name]: value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Survey responses:', surveyResponses);
    // Here you would send the surveyResponses to your backend or API.
    setShowSurvey(false);
    toast({
      title: 'Thank you for your feedback!',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      pos="sticky"
      top="20px"
      zIndex="1000"
    >
      {!feedbackGiven ? (
        <Box textAlign="center">
          <Box mb={2} fontWeight="bold">
            Was this page helpful?
          </Box>
          <Button
            aria-label="Like this article"
            variant="ghost"
            onClick={handleThumbsUp}
            mr={2}
          >
            <LikeIcon />
          </Button>
          <Button
            aria-label="Dislike this article"
            variant="ghost"
            onClick={handleThumbsDown}
          >
            <DislikeIcon />
          </Button>
        </Box>
      ) : (
        <Box textAlign="center" mb={4}>
          {thumbsUp
            ? 'Thank you for your feedback! Could you tell us more?'
            : "We're sorry to hear that. Could you help us improve?"}
        </Box>
      )}

      {showSurvey && (
        <Box mt={4}>
          <form onSubmit={handleSubmit}>
            {thumbsUp ? (
              <>
                <FormControl mb={4}>
                  <FormLabel>
                    What did you find most helpful about this page?
                  </FormLabel>
                  <Select
                    name="helpfulAspect"
                    onChange={handleInputChange}
                    placeholder="Select an option"
                  >
                    <option value="Clear instructions">
                      Clear instructions
                    </option>
                    <option value="Useful examples">Useful examples</option>
                    <option value="Concise information">
                      Concise information
                    </option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>
                    How easy was it to find the information you were looking
                    for?
                  </FormLabel>
                  <Input
                    type="number"
                    name="easeOfUse"
                    min="1"
                    max="5"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>
                    Any additional comments or suggestions for improvement?
                  </FormLabel>
                  <Textarea
                    name="additionalComments"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl mb={4}>
                  <FormLabel>What was the main issue you faced?</FormLabel>
                  <Select
                    name="issue"
                    onChange={handleInputChange}
                    placeholder="Select an option"
                  >
                    <option value="Outdated information">
                      Outdated information
                    </option>
                    <option value="Lack of clarity">Lack of clarity</option>
                    <option value="Missing examples">Missing examples</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>
                    Please provide more details about the problem you
                    encountered.
                  </FormLabel>
                  <Textarea name="issueDetails" onChange={handleInputChange} />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>
                    How would you rate the overall structure of this page?
                  </FormLabel>
                  <Input
                    type="number"
                    name="pageStructure"
                    min="1"
                    max="5"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Any additional comments or suggestions?</FormLabel>
                  <Textarea
                    name="additionalComments"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </>
            )}
            <Button type="submit" colorScheme="blue">
              Submit
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default FeedbackWidget;
