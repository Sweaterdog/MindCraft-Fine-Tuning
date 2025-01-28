# MindCraft-Fine-Tuning 🧠🔨
Files needed for contributing to Fine tuned models.
## Big models can play well, but can smaller models beat them?

We are setting out to make the best, and most affordable models for **YOUR** MindCraft experience

### How can I help?

If you would like to help collect data, download the ```logger.js``` file, and whatever API endpoint you plan on using, such as ```claude.js```
**DO NOT USE FINE TUNED LOCAL MODELS FOR MINDCRAFT FOR COLLECTING DATA**

## What do I do once I have installed logger.js, and my API endpoint?

After you downloaded logger.js, as well as all of the endpoints you would like to use, open logger.js, and choose what configuration you are collecting data for.
If you are collecting regular data, to improve the models, with NO vision NOR reasoning, then uncomment normal_logs.csv
IF you are collecting a certain type of data, such as reasoning or vision, uncomment that line.
The logging types should look something similar to the one below

```javascript
// --- LOGGING TYPE ---

// const CSV_LOG_FILE = join(LOGS_DIR, 'reasoning_logs.csv'); // Logs for adding reasoning
// const CSV_LOG_FILE = join(LOGS_DIR, 'normal_logs.csv'); // Regular logs
// const CSV_LOG_FILE = join(LOGS_DIR, 'vision_logs.csv'); // Logs for adding vision CURRENTLY NOT IMPLEMENTED, DO NOT ATTEMPT TO COLLECT VISION DATA

// --------------------
```

Once you have changed ```logger.js``` to the logging settings, put ```logger.js``` into the root file of MindCraft.
Once ```logger.js``` is in the root file, navigate to src\models and **DELETE** the old API endpoint, such as ```gpt.js``` and insert the new API endpoint, such as ```hyperbolic.js```

## I finished those changes, what now?

After you have made the changes, there is nothing you need to do! Simply load up Minecraft, play with your bot, and the data will get collected automatically!
Once you play for long enough, ~10 hours of playing or more, make a new dataset repository, on [huggingface](https://huggingface.co/new-dataset), and post a message to [this channel](https://ptb.discord.com/channels/1303399789995626667/1307448366833340508) with a link to your dataset repository.
MAKE SURE TO CHANGE THE NAME OF THE FILE TO YOUR USERNAME BEFORE MAKING THE PULL REQUEST, OR IT WILL BE DENIED. Example: ```Beethoven_reasoning.csv``` or ```Duolingo_vision.csv``` or ```Jimmy_regular.csv```

## I have uploaded my logs to the folder, what now?

Now that you have uploaded your logs, there is nothing else you need to do! You can continue to collect more data, or not!

Official TODO list:

# TODO List for LLM Fine-tuning

### Make a larger dataset
*Of course, more examples, the better the model, will ALWAYS be a work in progress*

### Develop a dataset including vision
*A Far off need, Andy-vision will eventually be made*

### Make a reasoning dataset
*Uses Deepseek-R1, or R1 distills to generate thought, to provoke thinking among Andy models, which may improve Andy-mini performance*

### Find GPU's here to tune the models
*Tuning any model, is very computationally expensive, it took 3 hours to train Andy-3.5 on one epoch using an A100, having someone here provide the resources to do it, both for free and without a time limit can allow us to make the models better*

### Make Andy-Ultra
*A model which can play Minecraft flawlessly, can reason and has vision*
