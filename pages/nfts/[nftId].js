import Header from '../../components/Header'
import { useEffect, useMemo, useState } from 'react'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { ThirdwebSDK as thirdwebSDK} from "@thirdweb-dev/sdk"

import { useRouter } from 'next/router'
import NFTImage from '../../components/nft/NFTImage'
import GeneralDetails from '../../components/nft/GeneralDetails'
import ItemActivity from '../../components/nft/ItemActivity'
import Purchase from '../../components/nft/Purchase'

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}

const Nft = () => {
  const { provider } = useWeb3()
  const [selectedNft, setSelectedNft] = useState()
  const [listings, setListings] = useState([])
  const router = useRouter()

  const nftModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(provider.getSigner() )
    return sdk.getNFTModule('0x40eab2422AeEf9a7775cC0A7Edcd703c278b9cc6')
  }, [provider])

  // get all NFTs in the collection
  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getAll()

      const selectedNftItem = nfts.find((nft) => nft.id === router.query.nftId)

      setSelectedNft(selectedNftItem)
      console.log(selectedNftItem)
    })()
  }, [nftModule])

  // const marketPlaceModule = useMemo(() => {
  //   if (!provider) return

  //   const sdk = new ThirdwebSDK(
  //     provider.getSigner(),
  //     // 'https://rinkeby.infura.io/v3/a464b9152d8c466c8a94a514fce8e837'
  //   )

  //   return sdk.getMarketplaceModule(
  //     // '0x93A771F7ce845C33381f677489cF21a5964EDD0b'
  //     '0x588a0EA7E9667797c9E76F766e5dDc3A8d2c7b36'
  //   )
  // }, [provider])

  // useEffect(() => {
  //   if (!marketPlaceModule) return
  //   ;(async () => {
  //     setListings(await marketPlaceModule.getAllListings())
  //     console.log(listings)
  //   })()
  // }, [marketPlaceModule])

  const marketPlaceModule = useMemo(() => {
    if (!provider) return

    const sdk = new thirdwebSDK(provider.getSigner())
    return sdk.getContract( '0x588a0EA7E9667797c9E76F766e5dDc3A8d2c7b36',"marketplace-v3")
  }, [provider])

  // get all listings in the collection
  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      const li=await (await marketPlaceModule).directListings.getAllValid()
      console.log(li)
      setListings(li)
    })()
  }, [marketPlaceModule])

  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
              <Purchase
                isListed={router.query.isListed}
                selectedNft={selectedNft}
                listings={listings}
                marketPlaceModule={marketPlaceModule}
              />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  )
}

export default Nft
