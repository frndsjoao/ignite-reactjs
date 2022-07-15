import { Button } from "@chakra-ui/react";

interface PaginationProps {
  number: number
  isCurrent?: boolean
  onPageChange: (page: number) => void
}

export function PaginationIntem({ 
  isCurrent = false,
  number,
  onPageChange
}: PaginationProps) {

  if(isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        w="4"
        colorScheme="pink"
        disabled
        _disabled={{
          bgColor: 'pink.500',
          cursor: 'default'
        }}
      >
        {number}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      w="4"
      bgColor="gray.700"
      onClick={() => onPageChange(number)}
      _hover={{
        bgColor: "gray.500"
      }}
    >
      {number}
    </Button>
  )
}