import React from 'react';

export default class About extends React.Component {
  render () {
    return (
      <main className='about-content'>
        <section className='about'>
          <h1>Visualization of HDB Resale Market</h1>

          <p>With Singapore rolling out its <a href='http://www.smartnation-forbes.com/' target='_parent'>Smart Nation Vision</a> and the recent launch of IDA&#39;s new <a href='https://data.gov.sg/' target='_parent'>open data portal</a>,
            budding web developers <a href='https://github.com/caalberts' target='_parent'>Albert Salim</a> and <a href='https://github.com/yongjun21' target='_parent'>Yong Jun</a> embarked on building our first data visualization project.
          </p>

          <p>
            The two of us took a public dataset, the <a href='https://data.gov.sg/dataset/resale-flat-prices' target='_parent'>HDB Resale Flat Prices</a>, and made use of the latest web technologies to present data in the most intuitive and
            accessible manner for the public to better understand trends in the HDB resale market.
            We design our app for the user to explore data from 2 perspectives: time and space.
            Data is presented in the form of:
          </p>

          <ol type='i'>
            <li>A time series chart showing historical price trends, and</li>
            <li>A heat map showing the hottest locations for HDB resale in Singapore.</li>
          </ol>

          <p>
            We hope the marriage of data and web will make the normally dry subject more interesting
            to the average man. And hopefully, public can become more aware of the availability
            of these open data and how they can be tapped to make life better for everyone.
            This is our contribution as web developers to the Smart Nation Movement.
          </p>
        </section>

        <section className='about'>
          <h1>How it works</h1>

          <div className='img-ctn'>
            <img src='./img/Average_Screenshot.png' alt='Image not loaded' />
            <img src='./img/MMM_Screenshot.png' alt='Image not loaded' />
          </div>

          <ul>
            <li>The <b>Charts</b> tab opens a time-series chart of historical resale prices.</li>
            <li>User can toggle between two modes: <b>Average</b> & <b>Min, Max & Median</b>.</li>
            <li>User chooses the <b>town</b> and returned chart is a set of time-series broken down by <b>flat types</b>.</li>
            <li>Click on any point on the chart to bring out a list of all the transactions
            in the selcted town for the month and flat type.</li>
          </ul>

          <h3>Average</h3>
          <p>
            Markers represent average transaction price in that month while the error bars captures the variance of data points around the mean. The length of the error bars on each side equals one standard deviation which covers ~70% of the distribution.
          </p>

          <h3>Min, Max & Median</h3>
          <p>
            Markers represent median transaction price while error bars connect to the highest and lowest transacted prices.
          </p>
        </section>

        <section className='about'>
          <div className='img-ctn'>
            <img src='./img/Heatmap_Screenshot.png' alt='Image not loaded' />
          </div>

          <h3>Heatmap</h3>
          <p>
            The <b>Maps</b> tab opens a geographical heat map of resale transactions organized by month.
            Red spots indicates areas where there&#39;s either:
          </p>
          <ol type='i'>
            <li>a concentration of transactions, or</li>
            <li>some data points with higher than average transaction prices</li>
          </ol>

          <h3>Navigation</h3>
          <ul>
            <li>To select a particular month, either use the drop down, or</li>
            <li>Click on the buttons on the sides to scroll to previous month or next month.</li>
            <li>Pan and pinch to explore.</li>
            <li>Click on button at the bottom will re-center the map.</li>
          </ul>
        </section>
      </main>
    );
  }
}
