import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import {ButtonLink} from './RelativeLink';
import {DislikeIcon, LikeIcon} from './Icons';
import {useUser} from '../utils';

const Feedback = () => {
  const {user} = useUser();
  const username = user?.name;
  const [path, setPath] = useState('');
  const [rating, setRating] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState({
    positives: [],
    issues: [],
    issueDetails: '',
    additionalComments: ''
  });

  const {isOpen, onOpen, onClose} = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname);
    }
  }, []);

  const handleRating = async ratingType => {
    setRating(ratingType);

    try {
      // Append rating to GoogleSheet
      await axios.post('/.netlify/functions/sendFeedback', {
        path,
        rating: ratingType,
        username
      });

      // Open the modal
      onOpen();
    } catch (error) {
      console.error('Error handling rating:', error);
    }
  };

  const handleInputChange = e => {
    const {name, value} = e.target;
    setSurveyResponses(prevResponses => ({
      ...prevResponses,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name, value) => {
    setSurveyResponses(prevResponses => ({
      ...prevResponses,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const feedbackData = {
        path,
        rating,
        ...surveyResponses,
        username
      };

      // Send feedback data to the Netlify function
      await axios.post('/.netlify/functions/sendFeedback', feedbackData);

      onClose();
      toast({
        title: 'Thank you for your feedback!',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error sending form response:', error);
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
    setRating(null);
    setSurveyResponses({
      positives: [],
      issues: [],
      issueDetails: '',
      additionalComments: ''
    });
    onClose();
  };

  const positiveOptions = [
    'Clear instructions',
    'Concise information',
    'Useful examples',
    'Other (Please specify below)'
  ];

  const issueOptions = [
    'Incorrect information',
    'Lack of clarity',
    'Missing examples',
    'Other (Please specify below)'
  ];

  return (
    <Box pos="sticky" top="20px" zIndex="1000">
      <Box my="4">
        <Text
          as="span"
          fontSize="lg"
          fontWeight="semibold"
          color={'gray.500'}
          _dark={{color: 'gray.200'}}
          ml="0.5rem"
          display={{base: 'none', lg: 'inline'}}
        >
          Was this page helpful?
        </Text>
        <IconButton
          variant="link"
          aria-label="Like page"
          _focus={{
            outline: 'none',
            boxShadow: 'none'
          }}
          sx={{
            position: 'relative',
            _hover: {
              _after: {
                content: '""',
                position: 'absolute',
                bottom: '-3px', // Adjust the position as needed
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '1.5px',
                backgroundColor: 'currentColor' // Match the color of the icon
              }
            }
          }}
          onClick={() => handleRating('like')}
        >
          <LikeIcon color={'gray.500'} _dark={{color: 'gray.200'}} />
        </IconButton>
        <IconButton
          variant="link"
          aria-label="Dislike page"
          _focus={{
            outline: 'none',
            boxShadow: 'none'
          }}
          sx={{
            position: 'relative',
            _hover: {
              _after: {
                content: '""',
                position: 'absolute',
                bottom: '-3px', // Adjust the position as needed
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '1.5px',
                backgroundColor: 'currentColor' // Match the color of the icon
              }
            }
          }}
          onClick={() => handleRating('dislike')}
        >
          <DislikeIcon color={'gray.500'} _dark={{color: 'gray.200'}} />
        </IconButton>
      </Box>

      <Modal isOpen={isOpen} onClose={handleClose} size="3xl">
        <ModalOverlay />
        <ModalContent p="4" mx={[4, 6, 8]} bg="bg">
          <ModalHeader>
            {rating === 'like'
              ? 'Thank you for your feedback!'
              : "We're sorry to hear that. Please help us improve!"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              {rating === 'like' ? (
                <>
                  <FormControl mb={6}>
                    <FormLabel>
                      What did you find helpful about this page?
                    </FormLabel>
                    <CheckboxGroup
                      colorScheme="green"
                      value={surveyResponses.positives}
                      onChange={value =>
                        handleCheckboxChange('positives', value)
                      }
                    >
                      <Stack>
                        {positiveOptions.map(option => (
                          <Checkbox key={option} value={option}>
                            {option}
                          </Checkbox>
                        ))}
                      </Stack>
                    </CheckboxGroup>
                  </FormControl>
                  <FormControl mb={6}>
                    <FormLabel>
                      Any additional comments or suggestions?
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
                    <FormLabel>Which areas need improvement?</FormLabel>
                    <CheckboxGroup
                      colorScheme="green"
                      value={surveyResponses.issues}
                      onChange={value => handleCheckboxChange('issues', value)}
                    >
                      <Stack>
                        {issueOptions.map(option => (
                          <Checkbox key={option} value={option}>
                            {option}
                          </Checkbox>
                        ))}
                      </Stack>
                    </CheckboxGroup>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>
                      Please provide more details about the problem you
                      encountered.
                    </FormLabel>
                    <Textarea
                      name="issueDetails"
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>
                      Any additional comments or suggestions?
                    </FormLabel>
                    <Textarea
                      name="additionalComments"
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </>
              )}
            </form>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4} justify="flex-end">
              <ButtonLink
                colorScheme="gray"
                href="https://support.apollographql.com/hc/en-us"
              >
                Need help? Contact Support
              </ButtonLink>
              <Button
                bg="primary"
                color="#FDFDFD"
                _dark={{
                  color: 'silver.300'
                }}
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Feedback;
