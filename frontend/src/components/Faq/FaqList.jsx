// eslint-disable-next-line no-unused-vars
/**import React from 'react'
import {faqs} from './../../assets/data/faqs'
import FaqItem from './FaqItem'

const FaqList = () => {
  return (
    <ul className="mt-[38px]">
        {faqs.map((item, index) => (
            <FaqItem item={item} key={index} />
        ))}
    </ul>
  );
};

export default FaqList;*/

import React, { useState } from 'react';
import { faqs } from '../../assets/data/faqs'; // Adjust the import path as necessary
import FaqItem from './FaqItem';

const FaqList = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <ul className="mt-[38px]">
      {faqs.map((item, index) => (
        <FaqItem 
          item={item} 
          key={index} 
          index={index} 
          toggleFaq={toggleFaq} 
          isOpen={openFaqIndex === index} 
        />
      ))}
    </ul>
  );
};

export default FaqList;