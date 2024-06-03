import React, {useState} from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react';
import {CloseIcon, DislikeIcon, LikeIcon} from './Icons';
import {default as ReactSelect} from 'react-select';

const FeedbackWidget = () => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState({
    positives: [],
    additionalComments: '',
    issues: [],
    issueDetails: ''
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

  const handleMultiSelectChange = selectedOptions => {
    setSurveyResponses(prevResponses => ({
      ...prevResponses,
      areas: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://sheets.googleapis.com/v4/spreadsheets/{YOUR_SPREADSHEET_ID}/values/Sheet1!A1:append?valueInputOption=RAW',
        {
          range: 'Sheet1!A1',
          values: Object.values(surveyResponses)
        },
        {
          params: {
            majorDimension: 'ROWS'
          },
          Titles: {
            'Content-Type': 'application/json'
            // Authorization: `Bearer ${authClient.credentials.access_token}`
          }
        }
      );

      console.log('Form response sent to Google Sheet:', response.data);
      setShowSurvey(false);
      toast({
        title: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error sending form response to Google Sheet:', error);
      toast({
        title: 'An error occurred!',
        description: 'Failed to submit feedback. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleClose = () => {
    setFeedbackGiven(false);
    setShowSurvey(false);
    setThumbsUp(false);
    setSurveyResponses({
      positives: [],
      additionalComments: '',
      issues: [],
      issueDetails: ''
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
        <Box>
          {showSurvey && (
            <Box
              textAlign="right"
              mb={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading fontSize="m" as="h3" pb="1">
                (Optional) Survey
              </Heading>
              <IconButton
                icon={<CloseIcon />}
                onClick={handleClose}
                variant="ghost"
                aria-label="Close feedback form"
              />
            </Box>
          )}
          <Box mb={4}>
            <Text fontSize="m" as="h3" pb="1">
              {thumbsUp
                ? 'Thank you for your feedback!'
                : "We're sorry to hear that."}
            </Text>
            <Text>
              {thumbsUp
                ? 'Could you tell us more?'
                : 'Could you help us improve?'}
            </Text>
          </Box>
        </Box>
      )}

      {showSurvey && (
        <Box mt={4}>
          <form onSubmit={handleSubmit}>
            {thumbsUp ? (
              <>
                <FormControl mb={4}>
                  <FormLabel>
                    What did you find helpful about this page?
                  </FormLabel>
                  <ReactSelect
                    isMulti
                    name="positives"
                    options={[
                      {
                        value: 'Clear instructions',
                        label: 'Clear instructions'
                      },
                      {
                        value: 'Concise information',
                        label: 'Concise information'
                      },
                      {value: 'Useful examples', label: 'Useful examples'},
                      {value: 'Other', label: 'Other'}
                    ]}
                    onChange={handleMultiSelectChange}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Comments or suggestions?</FormLabel>
                  <Textarea
                    name="additionalComments"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <FormControl mb={4}>
                  <FormLabel>Which areas need improvement?</FormLabel>
                  <ReactSelect
                    isMulti
                    name="issues"
                    options={[
                      {
                        value: 'Incorrect information',
                        label: 'Incorrect information'
                      },
                      {value: 'Lack of clarity', label: 'Lack of clarity'},
                      {value: 'Missing examples', label: 'Missing examples'},
                      {value: 'Other', label: 'Other'}
                    ]}
                    onChange={handleMultiSelectChange}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>
                    Please provide more details about the problem you
                    encountered.
                  </FormLabel>
                  <Textarea name="issueDetails" onChange={handleInputChange} />
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
            <Button type="submit">Submit</Button>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default FeedbackWidget;
