import React, { useState, useEffect, useRef } from "react";

import useOutsideClick from "helpers/outsideClick";

import NewLineItemTable from "./NewLineItemTable";

import TableHeader from "../common/LineItemTableHeader";
import NewLineItemRow from "../common/NewLineItemRow";
import { fetchNewLineItems } from "../common/utils";
import ManualEntry from "../Generate/ManualEntry";
import MultipleEntriesModal from "../MultipleEntriesModal";

const InvoiceTable = ({
  currency,
  selectedClient,
  lineItems,
  setLineItems,
  selectedLineItems,
  setSelectedLineItems,
  manualEntryArr,
  setManualEntryArr
}) => {
  const [addNew, setAddNew] = useState<boolean>(false);
  const [showItemInputs, setShowItemInputs] = useState<boolean>(false);
  const [totalLineItems, setTotalLineItems] = useState<number>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [showMultiLineItemModal, setMultiLineItemModal] = useState<boolean>(false);
  const [addManualLineItem, setAddManualLineItem] = useState<boolean>(false);

  useEffect(() => {
    if (addManualLineItem) return setAddManualLineItem(false);

    if (addNew) {
      loadNewLineItems();
    }
  }, [addNew]);

  const wrapperRef = useRef(null);

  const loadNewLineItems = () => {
    fetchNewLineItems(
      selectedClient,
      lineItems,
      setLineItems,
      setTotalLineItems,
      pageNumber,
      setPageNumber,
      selectedLineItems
    );
  };

  useOutsideClick(wrapperRef, () => {
    setAddNew(false);
    setPageNumber(1);
    setLineItems([]);
  }, addNew);

  const getNewLineItemDropdown = () => {
    if (lineItems) {
      return <NewLineItemTable
        setShowItemInputs={setShowItemInputs}
        addNew={addNew}
        setAddNew={setAddNew}
        lineItems={lineItems}
        setLineItems={setLineItems}
        loadMoreItems={loadNewLineItems}
        totalLineItems={totalLineItems}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        selectedLineItems={selectedLineItems}
        setSelectedLineItems={setSelectedLineItems}
        manualEntryArr={manualEntryArr}
        setManualEntryArr={setManualEntryArr}
        setMultiLineItemModal={setMultiLineItemModal}
        setAddManualLineItem={setAddManualLineItem}
      />;
    }
    return (
      <div className="h-48 flex items-center justify-center">Please select Client to add line item.</div>
    );
  };

  const getAddNewButton = () => {
    if (addNew) {
      return <div ref={wrapperRef} className="box-shadow rounded absolute m-0 font-medium text-sm text-miru-dark-purple-1000 bg-white top-0 w-full">
        {getNewLineItemDropdown()}
      </div>;
    } else {
      return <button
        className=" py-1 tracking-widest w-full bg-white font-bold text-base text-center text-miru-dark-purple-200 rounded-md border-2 border-miru-dark-purple-200 border-dashed"
        onClick={() => {
          setAddNew(!addNew);
        }}
        data-cy="edit-new-line-item"
      >
        + NEW LINE ITEM
      </button>;
    }
  };

  return (
    <React.Fragment>
      <table className="w-full table-fixed">
        <TableHeader />
        <tbody className="w-full">
          <tr className="w-full">
            <td colSpan={6} className="py-4 relative">
              {getAddNewButton()}
            </td>
          </tr>
          {
            showItemInputs
            && (manualEntryArr.map((entry) =>
              <ManualEntry
                entry={entry}
                manualEntryArr={manualEntryArr}
                setManualEntryArr={setManualEntryArr}
              />
            ))
          }
          {
            selectedLineItems.length > 0
            && selectedLineItems.map((item, index) => (
              !item._destroy &&
              <NewLineItemRow
                key={index}
                currency={currency}
                item={item}
                selectedOption={selectedLineItems}
                setSelectedOption={setSelectedLineItems}
              />
            ))
          }
        </tbody>
      </table>
      <div>
        {showMultiLineItemModal && <MultipleEntriesModal
          selectedClient={selectedClient}
          selectedOption={selectedLineItems}
          setSelectedOption={setSelectedLineItems}
          setMultiLineItemModal={setMultiLineItemModal}
        />}
      </div>
    </React.Fragment>
  );
};

export default InvoiceTable;
