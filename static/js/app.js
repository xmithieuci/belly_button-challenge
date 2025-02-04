// Build the metadata panel
function buildMetadata(sampleData) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sampleData);

    // Use d3 to select the panel with id of `#sample-metadata`
    let result = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    result.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(resultArray[0]).forEach(([key, value]) => {
      result.append('h6').text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sampleData) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sampleData);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = resultArray[0].otu_ids;
    let otu_labels = resultArray[0].otu_labels;
    let sample_values = resultArray[0].sample_values;

    // Build a Bubble Chart
    let bubble_chart = {
      mode: 'markers',
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    // Render the Bubble Chart
    let bubble_data = [bubble_chart];
    let bubble_layout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      yaxis: {
        title: 'Number of Bacteria'
      }
    };
    Plotly.newPlot('bubble', bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bar_chart = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'navy'
      }
    };

    // Render the Bar Chart
    let bar_data = [bar_chart];
    let bar_layout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot('bar', bar_data, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sampleData) => {
      dropdown.append('option').text(sampleData).property('value', sampleData);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSampleData) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSampleData);
  buildCharts(newSampleData);
}

// Initialize the dashboard
init();