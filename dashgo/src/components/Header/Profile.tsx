import { Flex, Box, Avatar, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean
}
export function Profile({ showProfileData }: ProfileProps) {

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>João Pedro Assunção</Text>
          <Text color="gray.300" fontSize="sm">
            joaofernandes.dev@hotmail.com
          </Text>
        </Box>
      )}

      <Avatar 
        size="md" 
        name="João Pedro Assunção"
        src='#'
      />
    </Flex>
  )
}