import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBox = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const search = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/explorer/search?key=${searchQuery}`
      );

      if (data.code === 200) {
        switch (data.type) {
          case "block":
            router.push(`/blocks/${searchQuery}`);
            break;
          case "transaction":
            router.push(`/transactions/${searchQuery}`);
            break;
          case "address":
            router.push(`/address/${searchQuery}`);
            break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  const handleChangeQuery = (event) => {
    setSearchQuery(event.target.value.trim());
  };

  return (
    <InputGroup>
      <InputRightElement>
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          onClick={search}
        />
      </InputRightElement>

      <Input
        bg="white"
        placeholder="Cari berdasarkan Alamat / Hash Transaksi / Hash Blok / Nomor Blok"
        type="text"
        value={searchQuery}
        onChange={handleChangeQuery}
        onKeyDown={handleKeyDown}
      />
    </InputGroup>
  );
};

export default SearchBox;
