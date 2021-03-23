module.exports = {
  rules: {
    "no-underscore": {
      create: function (context) {
        return {
          FunctionExpression: function (node) {
            const functionNode = node.parent.key;
            const parentNode = functionNode.parent;
            if (!parentNode.accessibility || parentNode.accessibility !== 'private') return;

            const functionName = functionNode.name;
            if (functionNode.name[0] === '_') return;

            context.report({
              node,
              message: "{{ identifier }}: Private function require \"_\" prefix.",
              data: {
                identifier: functionName
              }
            });
          }
        };
      }
    },
    "no-handle-prefix": {
      create: function (context) {
        return {
          FunctionExpression: function (node) {
            const functionNode = node.parent.key;
            const parentNode = functionNode.parent;
            const functionName = functionNode.name;

            const noPrefixHandleFns = parentNode.value.params.filter(param => {
              const typeAnnotation = param.typeAnnotation.typeAnnotation;
              if (typeAnnotation.type !== 'TSTypeReference') return;
              if (typeAnnotation.typeName.name !== "Event") return;
              const noPrefix = functionName.indexOf('handle') === -1;

              return noPrefix;
            });

            if (noPrefixHandleFns.length === 0) return;

            noPrefixHandleFns.forEach(fn => {
              context.report({
                node,
                message: "{{ identifier }}: Event handler required \"handle\" prefix.",
                data: {
                  identifier: fn.parent.parent.key.name
                }
              });
            });
          }
        };
      }
    },
    "no-alphabet-order": {
      create: function (context) {
        const sourceCode = context.getSourceCode();

        function checkAndReportTypes(node, propInfos) {
          const types = propInfos.map(info => {
            return info.type;
          });

          const wrongOrderTypes = [];
          types.forEach((type, index) => {
            const next = types[index + 1];
            if (!next || type <= next) return false;
            wrongOrderTypes.push({type, next});
          });

          wrongOrderTypes.forEach(wrongOrderType => {
            context.report({
              node,
              message: `"${wrongOrderType.type}" should be place after "${wrongOrderType.next}"`,
            });
          });
        }

        function checkAndReportNames(node, propInfos) {
          const group = {};
          propInfos.forEach(info => {
            if (!group[info.type])  group[info.type] = [];
            group[info.type].push(info.name);
          });

          const wrongOrderNames = [];
          Object.keys(group).forEach(type => {
            const names = group[type];
            names.forEach((name, index) => {
              const next = names[index + 1];
              if (!next || name <= next) return false;
              wrongOrderNames.push({name, next});
            });
          });

          wrongOrderNames.forEach(wrongOrderName => {
            context.report({
              node,
              message: `"${wrongOrderName.name}" should be place after "${wrongOrderName.next}"`,
            });
          });
        }

        return {
          Identifier(node) {
            if(node.parent.type !== "TSTypeAliasDeclaration") return;
            const props = node.parent.typeAnnotation.members;
            const propInfos = props.map(prop => {
              const type = prop.typeAnnotation.typeAnnotation;
              const typeValue = sourceCode.getTokenByRangeStart(type.range[0]).value;
          
              return {name: prop.key.name, type: typeValue};
            });

            checkAndReportTypes(node, propInfos);
            checkAndReportNames(node, propInfos);
          },
        };
      }
    }
  }
};
