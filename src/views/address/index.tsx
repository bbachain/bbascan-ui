import React, { FC } from "react";
import { PublicKey } from '@bbachain/web3.js';

// Components
import { HeadContainer } from "components/HeadContainer";
import { AddressDetail } from "components/AddressDetail";
import { ErrorCard } from 'components/common/ErrorCard';

// Hooks
import { useAddress, useFetchAddress } from 'hooks/useAddress';
import { ClusterStatus, useCluster } from 'hooks/useCluster';

type Props = { address: string }

export const AddressDetailView: FC<Props> = ({ address }) => {
  const info = useAddress(address);
  const fetchAccount = useFetchAddress();

  const { status } = useCluster();

  let pubkey: PublicKey | undefined;

  try {
    pubkey = new PublicKey(address);
  } catch (err) {}

  // Fetch account on load
  React.useEffect(() => {
    if (!info && status === ClusterStatus.Connected && pubkey) {
      fetchAccount(pubkey, "parsed");
    }
  }, [address, status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-4">
      <HeadContainer />

      <div className="w-full mb-4">
        {!pubkey ? (
          <ErrorCard text={`Address "${address}" is not valid`} />
        ) : (
          <AddressDetail pubkey={pubkey} info={info} />
        )}
      </div>
    </div>
  );
};
